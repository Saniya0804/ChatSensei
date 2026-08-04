import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            {/* Navbar */}
            <nav className="border-b border-slate-800/80 bg-slate-950/80">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">

                    {/* Brand */}
                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <span className="text-xl">
                                📄
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-semibold tracking-tight">
                                ChatSensei
                            </h1>

                            <p className="text-[11px] text-slate-500">
                                AI DOCUMENT ASSISTANT
                            </p>
                        </div>

                    </div>


                    {/* Navigation */}
                    <div className="flex items-center gap-2">

                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition"
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/register"
                            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/20"
                        >
                            Get Started
                        </Link>

                    </div>

                </div>
            </nav>


            {/* Hero */}
            <main className="flex-1">

                <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">

                    <div className="max-w-4xl mx-auto text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-full text-sm">

                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>

                            AI-powered document intelligence

                        </div>


                        {/* Main Heading */}
                        <h2 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">

                            Chat with your documents.

                            <span className="block text-indigo-400 mt-2">
                                Find answers instantly.
                            </span>

                        </h2>


                        {/* Description */}
                        <p className="mt-7 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed">

                            Upload your PDF documents and transform complex
                            information into intelligent conversations. Ask
                            questions and get contextual answers powered by AI.

                        </p>


                        {/* Main CTA */}
                        <div className="mt-10">

                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-medium text-lg transition duration-200 shadow-xl shadow-indigo-500/20"
                            >
                                Get Started Free

                                <span>
                                    →
                                </span>
                            </Link>

                        </div>


                        {/* CTA Note */}
                        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500">

                            <span>
                                No credit card required
                            </span>

                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>

                            <span>
                                Simple setup
                            </span>

                        </div>

                    </div>


                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">


                        {/* Upload */}
                        <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-indigo-500/40 hover:bg-slate-900 transition duration-300">

                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl mb-6">
                                📄
                            </div>

                            <h3 className="text-lg font-semibold">
                                Upload your documents
                            </h3>

                            <p className="text-slate-400 mt-3 text-sm leading-6">

                                Securely upload and manage your PDF documents
                                inside a centralized AI-powered workspace.

                            </p>

                        </div>


                        {/* Ask */}
                        <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-indigo-500/40 hover:bg-slate-900 transition duration-300">

                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl mb-6">
                                💬
                            </div>

                            <h3 className="text-lg font-semibold">
                                Ask anything
                            </h3>

                            <p className="text-slate-400 mt-3 text-sm leading-6">

                                Ask natural language questions and intelligently
                                search information across your documents.

                            </p>

                        </div>


                        {/* Answers */}
                        <div className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-indigo-500/40 hover:bg-slate-900 transition duration-300">

                            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-xl mb-6">
                                ✦
                            </div>

                            <h3 className="text-lg font-semibold">
                                Get contextual answers
                            </h3>

                            <p className="text-slate-400 mt-3 text-sm leading-6">

                                Receive relevant AI-generated responses grounded
                                in the actual content of your uploaded documents.

                            </p>

                        </div>

                    </div>


                    {/* How it works */}
                    <div className="mt-28">

                        <div className="text-center">

                            <p className="text-indigo-400 text-sm font-medium uppercase tracking-widest">
                                Simple workflow
                            </p>

                            <h2 className="text-3xl md:text-4xl font-bold mt-4">
                                From PDF to answers in seconds
                            </h2>

                            <p className="text-slate-400 mt-4">
                                No complex setup. Upload, ask, and understand.
                            </p>

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">

                            <div className="text-center">

                                <div className="w-10 h-10 mx-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold">
                                    1
                                </div>

                                <h3 className="font-semibold mt-5">
                                    Upload PDF
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">
                                    Add your documents to your workspace.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="w-10 h-10 mx-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold">
                                    2
                                </div>

                                <h3 className="font-semibold mt-5">
                                    Start a conversation
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">
                                    Create a chat session and ask your question.
                                </p>

                            </div>


                            <div className="text-center">

                                <div className="w-10 h-10 mx-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-semibold">
                                    3
                                </div>

                                <h3 className="font-semibold mt-5">
                                    Get AI-powered answers
                                </h3>

                                <p className="text-slate-500 text-sm mt-2">
                                    Receive answers grounded in your documents.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            {/* Footer */}
            <footer className="border-t border-slate-800">

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>📄</span>
                        <span>DocMind AI</span>
                    </div>

                    <p className="text-sm text-slate-600">
                        AI-powered document intelligence
                    </p>

                </div>

            </footer>

        </div>
    );
}