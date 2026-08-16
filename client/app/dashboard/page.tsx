"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("upload");

    const [file, setFile] = useState<File | null>(null);

    const [files, setFiles] = useState<
        { id: number; filename: string }[]
    >([]);

    const [currentSessionId, setCurrentSessionId] =
        useState<number | null>(null);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState<
        { question: string; answer: string }[]
    >([]);

    const [tempPdf, setTempPdf] = useState<File | null>(null);

    const [sessions, setSessions] = useState<
        { id: number; session_name: string }[]
    >([]);

    const [selectedSessionName, setSelectedSessionName] =
        useState("");

    const [sending, setSending] = useState(false);

    const [uploading, setUploading] = useState(false);

    // ==================================================
    // UPLOAD PDF
    // ==================================================

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Select a pdf");
            return;
        }

const token = localStorage.getItem("token");
        if (!token) {
            alert("please login first");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append("pdf", file);


            const response = await fetch(
                "http://localhost:8000/upload/files",
                {
                    method: "POST",
                     headers: {
            "Authorization": `Bearer ${token}`
        },
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("PDF uploaded successfully");

                setFile(null);

            } else {
                alert(data.message || "Upload failed");
            }

        } catch (error) {
            console.log(error);

            alert("Error uploading PDF");

        } finally {
            setUploading(false);
        }
    };


    // ==================================================
    // FETCH FILES
    // ==================================================

    const fetchFiles = async () => {
        try {
const token = localStorage.getItem("token");
            if (!token) {
                alert("please login first");
                return;
            }

            const response = await fetch(
                "http://localhost:8000/upload/files",
                {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
            );

            const data = await response.json();

            if (data.success) {
                setFiles(data.files);
            }
else {
            alert(data.message || "Unable to fetch files");
        }
        } catch (error) {
            console.log(error);
        }
    };


    // ==================================================
    // CREATE CHAT SESSION
    // ==================================================

    const createSession = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("please login first");
                return;
            }

            const response = await fetch(
                "http://localhost:8000/chat/session",
                {
                    method: "POST",

                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setCurrentSessionId(data.sessionId);

                setSelectedSessionName("New Chat");

                setMessages([]);

                setQuestion("");

                setTempPdf(null);

                fetchSessions();
            }

        } catch (error) {
            console.log(error);
        }
    };


    // ==================================================
    // SEND QUESTION
    // ==================================================

    const sendQuestion = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("please login first");
                return;
            }

            if (question.trim() === "") {
                alert("enter a question");
                return;
            }

            if (!currentSessionId) {
                alert("no session selected");
                return;
            }

            setSending(true);

            const formData = new FormData();

            formData.append("question", question);

            formData.append(
                "sessionId",
                currentSessionId.toString()
            );

            if (tempPdf) {
                formData.append("tempPdf", tempPdf);
            }

            const response = await fetch(
                "http://localhost:8000/chat/ask",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        question,
                        answer: data.answer
                    }
                ]);

                fetchSessions();

                setQuestion("");

                setTempPdf(null);

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);

            alert("error sending question");

        } finally {
            setSending(false);
        }
    };


    // ==================================================
    // FETCH CHAT SESSIONS
    // ==================================================

    const fetchSessions = async () => {
const token = localStorage.getItem("token");
        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8000/chat/session",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setSessions(data.sessions);
            }

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
    if (!token) {
        router.push("/login");
        return;
    }
        fetchSessions();
    }, []);


    // ==================================================
    // OPEN PREVIOUS SESSION
    // ==================================================

    const openSession = async (
        sessionId: number,
        sessionName: string
    ) => {
        setCurrentSessionId(sessionId);

        setSelectedSessionName(sessionName);

        setQuestion("");

        setTempPdf(null);
const token = localStorage.getItem("token");
        if (!token) {
            alert("please login first");
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:8000/chat/messages/${sessionId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessages(data.messages);
            }

        } catch (error) {
            console.log(error);
        }
    };


    // ==================================================
    // DELETE PDF
    // ==================================================

    const handleDelete = async (fileId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("please login first");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/upload/deleteFiles/${fileId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setFiles((prev) =>
                    prev.filter((file) => file.id !== fileId)
                );

                alert("File deleted successfully");

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log(error);

            alert("Error deleting file");
        }
    };


    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col">


            {/* ==================================================
                NAVBAR
            ================================================== */}

            <nav className="h-16 shrink-0 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-xl">📄</span>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold">
                            ChatSensei
                        </h1>

                        <p className="text-[10px] text-slate-500">
                            DOCUMENT INTELLIGENCE
                        </p>
                    </div>

                </div>


                <div className="text-xs text-slate-500">
                    AI-powered document workspace
                </div>

            </nav>


            {/* ==================================================
                BODY
            ================================================== */}

            <div className="flex flex-1 min-h-0">


                {/* ==================================================
                    SIDEBAR
                ================================================== */}

                <aside className="w-72 shrink-0 bg-slate-900/60 border-r border-slate-800 flex flex-col">


                    {/* Main Navigation */}

                    <div className="p-4 space-y-2">

                        <button
                            onClick={() => {
                                setActiveTab("upload");
                            }}
                            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${
                                activeTab === "upload"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            <span>⬆</span>

                            <span>Upload Files</span>
                        </button>


                        <button
                            onClick={() => {
                                setActiveTab("files");

                                fetchFiles();
                            }}
                            className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition ${
                                activeTab === "files"
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/10"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            <span>📁</span>

                            <span>Uploaded Files</span>
                        </button>

                    </div>


                    <div className="border-t border-slate-800" />


                    {/* Chat Sessions Header */}

                    <div className="px-5 pt-5 pb-3">

                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                            Chat Sessions
                        </h3>

                    </div>


                    {/* New Chat Button */}

                    <div className="px-4">

                        <button
                            onClick={async () => {
                                setActiveTab("chat");

                                await createSession();
                            }}
                            className="w-full border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 hover:bg-indigo-500/10 px-4 py-3 rounded-lg flex items-center gap-3 text-sm transition"
                        >
                            <span className="text-xl leading-none">
                                +
                            </span>

                            <span>
                                New Chat
                            </span>
                        </button>

                    </div>


                    {/* Chat Session List */}

                    <div className="flex-1 overflow-y-auto px-3 py-4">

                        {sessions.length === 0 ? (

                            <div className="text-center py-8">

                                <p className="text-sm text-slate-600">
                                    No conversations yet
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-1">

                                {sessions.map((session) => (

                                    <button
                                        key={session.id}

                                        onClick={() => {
                                            setActiveTab("chat");

                                            openSession(
                                                session.id,
                                                session.session_name
                                            );
                                        }}

                                        className={`w-full flex items-center gap-3 text-left px-3 py-3 rounded-lg text-sm transition ${
                                            currentSessionId === session.id &&
                                            activeTab === "chat"
                                                ? "bg-slate-800 text-white"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                                        }`}
                                    >

                                        <span className="shrink-0">
                                            💬
                                        </span>

                                        <span className="truncate">
                                            {session.session_name}
                                        </span>

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* Sidebar Bottom */}

                    <div className="border-t border-slate-800 p-4">

                        <p className="text-[11px] text-center text-slate-600">
                            Secure AI document assistant
                        </p>

                    </div>

                </aside>


                {/* ==================================================
                    RIGHT CONTENT
                ================================================== */}

                <main className="flex-1 min-w-0 overflow-hidden">


                    {/* ==================================================
                        UPLOAD SCREEN
                    ================================================== */}

                    {activeTab === "upload" && (

                        <div className="h-full overflow-y-auto p-8">

                            <div className="max-w-3xl mx-auto">

                                <div className="mb-8">

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Upload documents
                                    </h1>

                                    <p className="text-slate-400 mt-2">
                                        Add PDF files to your document knowledge base.
                                    </p>

                                </div>


                                <form onSubmit={handleUpload}>

                                    <label
                                        htmlFor="pdfInput"
                                        className="h-72 border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/40 hover:bg-indigo-500/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition"
                                    >

                                        <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl">
                                            📄
                                        </div>


                                        <h2 className="text-lg font-medium mt-5">
                                            Upload your PDF
                                        </h2>


                                        <p className="text-sm text-slate-500 mt-2">
                                            Click to select a document from your computer
                                        </p>


                                        {file && (

                                            <div className="mt-5 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">

                                                <span>
                                                    📄
                                                </span>

                                                <span className="text-sm text-indigo-300 max-w-sm truncate">
                                                    {file.name}
                                                </span>

                                            </div>

                                        )}

                                    </label>


                                    <input
                                        type="file"
                                        name="pdf"
                                        id="pdfInput"
                                        accept=".pdf"
                                        className="hidden"

                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setFile(e.target.files[0]);
                                            }
                                        }}
                                    />


                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="mt-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition shadow-lg shadow-indigo-500/20"
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Upload Document"}
                                    </button>

                                </form>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        UPLOADED FILES SCREEN
                    ================================================== */}

                    {activeTab === "files" && (

                        <div className="h-full overflow-y-auto p-8">

                            <div className="max-w-5xl mx-auto">


                                <div className="mb-8">

                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Uploaded documents
                                    </h1>

                                    <p className="text-slate-400 mt-2">
                                        Manage the documents available to your AI assistant.
                                    </p>

                                </div>


                                {files.length === 0 ? (

                                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl py-20 text-center">

                                        <div className="text-5xl">
                                            📁
                                        </div>

                                        <h2 className="text-lg font-medium mt-5">
                                            No documents uploaded
                                        </h2>

                                        <p className="text-sm text-slate-500 mt-2">
                                            Upload a PDF to start building your document knowledge base.
                                        </p>


                                        <button
                                            onClick={() => {
                                                setActiveTab("upload");
                                            }}
                                            className="mt-6 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-lg text-sm font-medium transition"
                                        >
                                            Upload document
                                        </button>

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {files.map((file) => (

                                            <div
                                                key={file.id}
                                                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex items-center gap-4 transition"
                                            >

                                                <div className="w-12 h-12 shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl">
                                                    📄
                                                </div>


                                                <div className="flex-1 min-w-0">

                                                    <p className="font-medium truncate">
                                                        {file.filename}
                                                    </p>

                                                    <p className="text-xs text-slate-500 mt-1">
                                                        PDF Document
                                                    </p>

                                                </div>


                                                <button
                                                    onClick={() => {
                                                        handleDelete(file.id);
                                                    }}
                                                    className="px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        CHAT SCREEN
                    ================================================== */}

                    {activeTab === "chat" && currentSessionId && (

                        <div className="h-full flex flex-col">


                            {/* Chat Header */}

                            <div className="h-16 shrink-0 border-b border-slate-800 px-6 flex items-center">

                                <div>

                                    <h2 className="font-semibold text-white">
                                        {selectedSessionName}
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-0.5">
                                        AI document conversation
                                    </p>

                                </div>

                            </div>


                            {/* Messages */}

                            <div className="flex-1 overflow-y-auto px-6 py-8">

                                <div className="max-w-3xl mx-auto space-y-8">


                                    {messages.length === 0 && (

                                        <div className="text-center pt-24">

                                            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                                ✦
                                            </div>

                                            <h2 className="text-xl font-semibold mt-5">
                                                Ask about your documents
                                            </h2>

                                            <p className="text-slate-500 text-sm mt-2">
                                                Ask questions using your uploaded PDF documents.
                                            </p>

                                        </div>

                                    )}


                                    {messages.map((msg, index) => (

                                        <div
                                            key={index}
                                            className="space-y-6"
                                        >

                                            {/* User Message */}

                                            <div className="flex justify-end">

                                                <div className="max-w-xl bg-indigo-600 px-5 py-3 rounded-2xl rounded-br-sm shadow-lg shadow-indigo-500/10">

                                                    <p className="text-sm leading-6">
                                                        {msg.question}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* AI Message */}

                                            <div className="flex items-start gap-3">

                                                <div className="w-9 h-9 shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
                                                    ✦
                                                </div>


                                                <div className="flex-1 pt-1">

                                                    <p className="text-sm text-slate-300 leading-7 whitespace-pre-wrap">
                                                        {msg.answer}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ))}


                                    {/* Loading */}

                                    {sending && (

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                                ✦
                                            </div>

                                            <div className="flex items-center gap-1 text-slate-500 text-sm">

                                                <span>
                                                    Analyzing documents
                                                </span>

                                                <span className="animate-pulse">
                                                    ...
                                                </span>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* ==================================================
                                QUESTION INPUT
                            ================================================== */}

                            <div className="shrink-0 border-t border-slate-800 bg-slate-950 px-6 py-5">

                                <div className="max-w-3xl mx-auto">


                                    <div className="bg-slate-900 border border-slate-700 focus-within:border-indigo-500 rounded-2xl p-3 transition">


                                        {/* Temporary PDF */}

                                        {tempPdf && (

                                            <div className="mb-3">

                                                <div className="inline-flex max-w-sm items-center gap-3 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg">

                                                    <span>
                                                        📄
                                                    </span>

                                                    <span className="text-sm text-slate-300 truncate">
                                                        {tempPdf.name}
                                                    </span>


                                                    <button
                                                        type="button"

                                                        onClick={() => {
                                                            setTempPdf(null);
                                                        }}

                                                        className="text-slate-500 hover:text-red-400 transition"
                                                    >
                                                        ✕
                                                    </button>

                                                </div>

                                            </div>

                                        )}


                                        <div className="flex items-center gap-2">


                                            {/* Hidden File Input */}

                                            <input
                                                type="file"
                                                id="tempPdf"
                                                accept=".pdf"
                                                className="hidden"

                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        setTempPdf(
                                                            e.target.files[0]
                                                        );
                                                    }
                                                }}
                                            />


                                            {/* Attach PDF */}

                                            <label
                                                htmlFor="tempPdf"
                                                title="Attach PDF for this question"
                                                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
                                            >
                                                📎
                                            </label>


                                            {/* Question */}

                                            <input
                                                type="text"

                                                value={question}

                                                onChange={(e) => {
                                                    setQuestion(e.target.value);
                                                }}

                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" &&
                                                        !sending
                                                    ) {
                                                        sendQuestion();
                                                    }
                                                }}

                                                placeholder="Ask a question about your documents..."

                                                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-slate-600 px-2"
                                            />


                                            {/* Send */}

                                            <button
                                                type="button"

                                                onClick={sendQuestion}

                                                disabled={sending}

                                                className="w-10 h-10 shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition"
                                            >
                                                ↑
                                            </button>

                                        </div>

                                    </div>


                                    <p className="text-center text-[11px] text-slate-600 mt-3">
                                        Attach a PDF to use it as temporary context for a single question.
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        NO CHAT SELECTED
                    ================================================== */}

                    {activeTab === "chat" && !currentSessionId && (

                        <div className="h-full flex items-center justify-center px-6">

                            <div className="text-center max-w-md">

                                <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                    💬
                                </div>

                                <h2 className="text-xl font-semibold mt-5">
                                    Start a conversation
                                </h2>

                                <p className="text-sm text-slate-500 mt-2">
                                    Create a new chat and start asking questions about your PDF documents.
                                </p>


                                <button
                                    onClick={async () => {
                                        setActiveTab("chat");

                                        await createSession();
                                    }}
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/20"
                                >
                                    + New Chat
                                </button>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}