import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 for generating unique IDs
import { NewTodoForm } from "./NewTodoForm";
import { TodoList } from "./TodoList";
import todoLogo from "./assets/todologo.png";
import { Note } from "./Note";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function App() {
    const [notebullet, updateNoteBullet] = useState();
    
    const [count, setCount] = useState(() => {
        const storedNumber = localStorage.getItem('COUNT');
        return storedNumber ? parseInt(storedNumber, 10) : 0;
    });

    const [todos, setTodos] = useState(() => {
        const localValue = localStorage.getItem("ITEMS");
        if (localValue === null) return [];
        return JSON.parse(localValue);
    });

    const [notes, setNotes] = useState(() => {
        try {
            const localValue = localStorage.getItem('NOTES');
            if (localValue === null) return [];
            return JSON.parse(localValue);
        } catch (error) {
            console.error('Error parsing notes from localStorage:', error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        localStorage.setItem('COUNT', count);
    }, [count]);

    useEffect(() => {
        localStorage.setItem("NOTES", JSON.stringify(notes));
    }, [notes]);

    function addNote(title) {
        const newNote = {
            id: uuidv4(), // Generate unique ID for note
            title: title
        };
        setNotes(prevNotes => [...prevNotes, newNote]);
        setCount(prevCount => prevCount + 1);
    }

    function addTodo(title, noteID) {
        const newTodo = {
            id: uuidv4(), // Generate unique ID for todo
            title: title,
            completed: false,
            noteID: noteID
        };
        setTodos(prevTodos => [...prevTodos, newTodo]);
    }

    function editTodo(id, newTitle) {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, title: newTitle } : todo
            )
        );
    }

    function editNote(id, newTitle) {
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === id ? { ...note, title: newTitle } : note
            )
        );
    }

    function toggleTodo(id, completed) {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: completed } : todo
            )
        );
    }

    function deleteTodo(id) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }

    function deleteNote(id) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        setCount(prevCount => prevCount - 1);
    }

    function handleOnDragEnd(result) {
      // Check if the drag operation is completed and dropped in a valid destination
      if (!result.destination) {
        return; // If not, do nothing
      }
    
      // Reorder the items based on the drag result
      const reorderedNotes = Array.from(notes);
      const [reorderedItem] = reorderedNotes.splice(result.source.index, 1);
      reorderedNotes.splice(result.destination.index, 0, reorderedItem);
    
      // Update the state with the reordered notes
      setNotes(reorderedNotes);
    }
    
  

    return (
        <>
            <div className="headContainer">
                <div className="lineGrid">
                    <hr />
                    <hr />
                    <hr />
                    <hr />
                </div>
                <img title="logo" src={todoLogo} />
                <h1 className="header">Todo List</h1>
            </div>
            <div className="formContainer">
                <NewTodoForm setCount={setCount} addNote={addNote} />
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="noteContainer">
                    <Droppable droppableId="dropNotes" direction="horizontal" >
                        {(provided) => (
                            <ul
                                className="NoteList"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {notes.map((note, index) => (
                                    <Draggable
                                        key={note.id}
                                        draggableId={note.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Note
                                                    key={note.id}
                                                    note={note}
                                                    deleteNote={deleteNote}
                                                    editNote={editNote}
                                                    todos={todos}
                                                    addTodo={addTodo}
                                                    toggleTodo={toggleTodo}
                                                    deleteTodo={deleteTodo}
                                                    editTodo={editTodo}
                                                />
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </>
    );
}
