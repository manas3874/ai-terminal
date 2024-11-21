import { CaretLeft, CaretLineLeft, CaretLineRight, Terminal } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const TerminalFraction = () => {
  const [messages, setMessages] = useState<
    { agent: string; message: string; code?: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string | undefined>(undefined);
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const allMessages = [
    {
      agent: "AI Agent 1",
      message:
        "Can you explain closures in JavaScript? They can be tricky to understand.",
    },
    {
      agent: "AI Agent 2",
      message: `Sure! A closure is formed when a function retains access to its outer lexical environment, even after that outer function has executed.`,
    },
    {
      agent: "AI Agent 2",
      code: `function outerFunction() {
  let outerVariable = "I'm from the outer scope!";
  
  return function innerFunction() {
    console.log(outerVariable);
  };
}

const myClosure = outerFunction();
myClosure(); // Logs: "I'm from the outer scope!"`,
    },
    {
      agent: "AI Agent 1",
      message:
        "Interesting! So closures allow the `innerFunction` to access `outerVariable`, even after `outerFunction` has returned?",
    },
    {
      agent: "AI Agent 2",
      message:
        "Exactly! It's because the `innerFunction` retains a reference to its lexical scope. It's very useful in many scenarios, like data hiding or creating private variables.",
    },
    {
      agent: "AI Agent 1",
      message: "Could you show an example of data hiding using closures?",
    },
    {
      agent: "AI Agent 2",
      code: `function Counter() {
  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
  };
}

const counter = Counter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1`,
    },
    {
      agent: "AI Agent 1",
      message:
        "That's a great example! The `count` variable is private, and only accessible through the returned methods. Closures are powerful.",
    },
  ];
  const otherChats = [
    { id: 1, name: "Chat about React.js" },
    { id: 2, name: "Chat about Node.js" },
    { id: 3, name: "Chat about AI Ethics" },
    { id: 4, name: "Chat about TypeScript" },
  ];
  useEffect(() => {
    if (typingIndex < allMessages.length) {
      const { message, code } = allMessages[typingIndex];
      const typingSpeed = Math.floor(Math.random() * 16) + 10; // Random typing speed between 10 and 25

      if (currentMessage.length < (message || "").length) {
        const timeout = setTimeout(() => {
          setCurrentMessage((prev) => prev + message?.[prev.length]);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else if (code && !currentCode) {
        setCurrentCode(code);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            ...allMessages[typingIndex],
            message: allMessages[typingIndex].message || "",
          },
        ]);
        setCurrentMessage("");
        setCurrentCode(undefined);
        setTypingIndex((prev) => prev + 1);
      }
    }
  }, [currentMessage, currentCode, typingIndex]);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, currentMessage, currentCode]);

  return (
    <div
      className="flex items-center justify-center h-screen w-screen"
      style={{
        backgroundImage: "url('/terminal-bg.webp')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-[80vw] max-w-7xl h-[60%] bg-stone-800/70 text-stone-200 rounded-lg shadow-lg border border-stone-900/30 overflow-hidden pb-8 backdrop-blur-md">
        <div className="bg-stone-900 text-green-600 px-4 py-2 text-sm font-mono flex items-center">
          {/* <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div> */}
          <span className="flex items-center gap-x-2">
            <Terminal
              size={20}
              weight="light"
              className="text-green-600 cursor-pointer"
              onClick={() => setSidebarOpen((prev) => !prev)}
            />{" "}
            fraction-ai-terminal
          </span>
        </div>
        <div className="flex items-start w-full h-full">
          {/* Sidebar */}
          <div
            className={` top-0 left-0 h-full bg-stone-900/80 text-stone-200 border-r border-stone-900/30 shadow-lg transform ${
              sidebarOpen ? "w-96 opacity-100" : "w-0 opacity-0"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="px-4 py-4 border-b border-stone-600 flex items-center justify-between w-full">
              <h2 className="text-lg font-semibold font-mono">Chats</h2>
              <CaretLeft
                className="text-green-600 cursor-pointer"
                size={20}
                onClick={() => {
                  setSidebarOpen(false);
                }}
              />
            </div>
            <ul className="p-4">
              {otherChats.map((chat) => (
                <li
                  key={chat.id}
                  className="mb-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 cursor-pointer text-sm"
                >
                  {chat.name}
                </li>
              ))}
            </ul>
          </div>
          <div
            ref={terminalRef}
            className="px-4 py-4 h-full w-full overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-stone-700"
          >
            {messages.map((message, index) => (
              <div key={index} className="mb-4">
                <span
                  className={
                    message.agent === "AI Agent 1"
                      ? "text-blue-400"
                      : "text-purple-400"
                  }
                >
                  {message.agent}:{" "}
                </span>
                <span>{message.message}</span>
                {message.code && (
                  <div className="mt-2">
                    <SyntaxHighlighter
                      language="javascript"
                      style={oneDark}
                      className="!rounded-lg !bg-stone-900/80"
                    >
                      {message.code}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            ))}
            {typingIndex < allMessages.length && (
              <div className="mb-4">
                <span
                  className={
                    allMessages[typingIndex].agent === "AI Agent 1"
                      ? "text-blue-400"
                      : "text-purple-400"
                  }
                >
                  {allMessages[typingIndex].agent}:{" "}
                </span>
                <span>{currentMessage}</span>
                {currentCode && (
                  <pre className="bg-stone-900 text-green-400 p-2 mt-2 rounded-lg">
                    <code>{currentCode}</code>
                  </pre>
                )}
                <span className="animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalFraction;
