import React from "react";

interface User {
    id: number,
    username: string,
}

const UserContext = React.createContext<User | undefined>(undefined);

export default UserContext;
export type { User };