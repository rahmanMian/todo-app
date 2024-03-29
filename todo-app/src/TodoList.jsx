import { TodoItem } from "./TodoItem"

export function TodoList({todos, toggleTodo, deleteTodo, editTodo}){
    return (
        <ul className="list">
      {todos.map(todo =>{
          return (<TodoItem {...todo} completed = {todo.completed} key ={todo.id}  title = {todo.title} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo}/>
      )
     })}
      
    </ul>
    )
}