import React, { useState, useEffect } from "react";
import "../../styles/index.css";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {

	const [newTodo, setNewTodo] = useState("");
	const [todoList, setTodoList] = useState([]);

	useEffect(() => {
		fetch("https://playground.4geeks.com/todo/users/alex5perez")
			.then((response) => response.json())
			.then((data) => {
				setTodoList(data.todos);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const handleEnter = (e) => {
		if (e.key === "Enter") {
			const data = { label: newTodo, done: false };

			fetch("https://playground.4geeks.com/todo/todos/alex5perez", {
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					setTodoList((prevList) => [...prevList, data]);
					setNewTodo("");
				})
				.catch(() => { });
		}
	};

	function handleDelete(index) {
		const itemToDelete = todoList[index];

		fetch(`https://playground.4geeks.com/todo/todos/${itemToDelete.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(() => {
				const newList = [...todoList];
				newList.splice(index, 1);
				setTodoList(newList);
			})
			.catch(() => { })
	}

	function handleDeleteAll() {
		fetch('https://playground.4geeks.com/todo/users/alex5perez', {
			method: 'DELETE'
		})
			.then(() => {
				return fetch('https://playground.4geeks.com/todo/users/alex5perez', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				})
			})
			.then(response => {
				return response.json();
			})
			.then(data => {
				setTodoList(data.todos || []);
			})
			.catch((err) => { err })
	}

	return (
		<div className="text-center container">
			<h1 className="text-center mt-5">TODO LIST</h1>
			<input className="form-control" placeholder="Añade una tarea"
				value={newTodo}
				onChange={(e) => {
					setNewTodo(e.target.value);
				}}
				onKeyDown={handleEnter} />
			<h3 className="mt-2">Todo: </h3>
			<ul>
				{todoList.length === 0 ? (
					<p>No hay tareas, añadir tareas</p>)
					: (todoList.map((todo, index) => (
						<p key={index} style={{ fontSize: "2rem" }}>
							{todo.label}
							<span
								style={{ color: "red", cursor: "pointer", marginLeft: "1rem" }}
								onClick={() => handleDelete(index)}>
								X
							</span>
						</p>
					))
					)}
			</ul>
			<div className="col-12">
				<button className="btn btn-danger" onClick={handleDeleteAll}>Eliminar toda la lista</button>
			</div>
		</div>
	);
};

export default Home;