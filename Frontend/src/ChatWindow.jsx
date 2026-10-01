import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        const message = prompt.trim();

        if (!message || loading) {
            return;
        }

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.error || "Failed to get response");
            }

            console.log(res);

            setReply(res.reply);
        } catch (err) {
            console.error("Chat error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!reply) {
            return;
        }

        setPrevChats((prevChats) => [
            ...prevChats,
            {
                role: "user",
                content: prompt
            },
            {
                role: "assistant",
                content: reply
            }
        ]);

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="chatWindow">

            <div className="navbar">
                <span>
                    GPTClone
                    <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div
                    className="userIconDiv"
                    onClick={handleProfileClick}
                >
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">

                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade plan
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </div>

                </div>
            )}

            <Chat />

            <ScaleLoader loading={loading} color="#fff" />

            <div className="chatInput">

                <div className="inputBox">

                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getReply();
                            }
                        }}
                    />

                    <div
                        id="submit"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>

                </div>

                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                    See Cookie Preferences.
                </p>

            </div>

        </div>
    );
}

export default ChatWindow;