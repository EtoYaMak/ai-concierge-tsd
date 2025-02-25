import React, { useState, useEffect } from 'react';

export function UserIdentifier({ onUserIdSet }: { onUserIdSet: (userId: string) => void }) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('chatUserId');
        if (storedUserId) {
            setUserId(storedUserId);
            onUserIdSet(storedUserId);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nickname = (e.target as any).nickname.value;
        if (nickname) {
            localStorage.setItem('chatUserId', nickname);
            setUserId(nickname);
            onUserIdSet(nickname);
        }
    };

    if (userId) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl mb-4">Welcome to the Chat Demo</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Enter a nickname"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Start Chatting
                    </button>
                </form>
            </div>
        </div>
    );
} 