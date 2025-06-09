import { useQuery } from '@tanstack/react-query'

interface Todo {
    id: number
    title: string
    completed: boolean
}

async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export function ExampleQuery() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    })

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Todo List</h2>
            <ul className="space-y-2">
                {data?.slice(0, 5).map((todo) => (
                    <li
                        key={todo.id}
                        className="p-2 border rounded hover:bg-gray-50"
                    >
                        <span className={todo.completed ? 'line-through' : ''}>
                            {todo.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
} 