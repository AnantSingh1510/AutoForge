import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

from tools.file_search import search_file
from tools.drive_upload import upload_to_drive
from tools.whatsapp_reply import send_whatsapp_message, set_sender
from agents.prompts import SYSTEM_PROMPT
from memory.store import get_history, save_interaction
from server.events import broadcast


def build_agent() -> AgentExecutor:
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0,
    )

    tools = [search_file, upload_to_drive, send_whatsapp_message]

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder("chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)

    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        max_iterations=6,
        handle_parsing_errors=True,
    )

_agent_executor: AgentExecutor = None


def get_agent() -> AgentExecutor:
    global _agent_executor
    if _agent_executor is None:
        _agent_executor = build_agent()
    return _agent_executor


async def run_agent(user_message: str, sender: str) -> str:
    """
    Run the file agent for a given user message.
    Handles memory, sets the WhatsApp sender, and broadcasts events.
    """
    # Set who to reply to on WhatsApp
    set_sender(sender)

    await broadcast({
        "event": "agent_thinking",
        "message": f"Processing: {user_message}",
        "sender": sender,
    })

    history = get_history(sender)

    chat_history = []
    for turn in history:
        chat_history.append(HumanMessage(content=turn["human"]))
        chat_history.append(AIMessage(content=turn["ai"]))

    try:
        agent = get_agent()
        result = await agent.ainvoke({
            "input": user_message,
            "chat_history": chat_history,
        })

        output = result.get("output", "Done.")

        save_interaction(sender, user_message, output)

        await broadcast({
            "event": "agent_complete",
            "output": output,
        })

        return output

    except Exception as e:
        error_msg = f"Something went wrong: {str(e)}"
        await broadcast({"event": "agent_error", "error": error_msg})
        return error_msg