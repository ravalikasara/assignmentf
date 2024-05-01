import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import './index.css'

class Tasks extends Component {
  state = {
    showAddTask: false,
    title: '',
    description: '',
    status: '',
    assignor: '',
    assignee: '',
    tasks: [],
  }

  componentDidMount() {
    this.getTasks()
  }

  // Fetch tasks from the backend
  async getTasks() {
    const url = 'https://assignment-3ooo.onrender.com/tasks' // Replace with your backend API URL
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('jwt_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()

      this.setState({tasks: data})
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  renderstatusField = () => {
    const {status} = this.state

    return (
      <>
        <label className="input-label" htmlFor="status">
          STATUS
        </label>
        <input
          type="text"
          id="status"
          className="password-input-field"
          value={status}
          onChange={this.onChangeStatus}
          placeholder="Status"
        />
      </>
    )
  }

  rendertitleField = () => {
    const {title} = this.state

    return (
      <>
        <label className="input-label" htmlFor="title">
          TITLE
        </label>
        <input
          type="text"
          id="title"
          className="username-input-field"
          value={title}
          onChange={this.onChangeTitle}
          placeholder="Enter Title"
        />
      </>
    )
  }

  renderassigneeField = () => {
    const {assignee} = this.state

    return (
      <>
        <label className="input-label" htmlFor="assignee">
          ASSIGNEE
        </label>
        <input
          type="text"
          id="assignee"
          className="username-input-field"
          value={assignee}
          onChange={this.onChangeAssignee}
          placeholder="Enter Assignee Name"
        />
      </>
    )
  }

  renderdescriptionField = () => {
    const {description} = this.state

    return (
      <>
        <label className="input-label" htmlFor="desc">
          TITLE
        </label>
        <input
          type="text"
          id="desc"
          className="username-input-field"
          value={description}
          onChange={this.onChangeDescription}
          placeholder="Enter Description"
        />
      </>
    )
  }

  renderassignorField = () => {
    const {assignor} = this.state

    return (
      <>
        <label className="input-label" htmlFor="assignor">
          ASSIGNOR
        </label>
        <input
          type="text"
          id="assignor"
          className="username-input-field"
          value={assignor}
          onChange={this.onChangeAssignor}
          placeholder="Enter Assignor Name"
        />
      </>
    )
  }

  onChangeTitle = event => {
    this.setState({title: event.target.value})
  }

  onChangeDescription = event => {
    this.setState({description: event.target.value})
  }

  onChangeStatus = event => {
    this.setState({status: event.target.value})
  }

  onChangeAssignee = event => {
    this.setState({assignee: event.target.value})
  }

  onChangeAssignor = event => {
    this.setState({assignor: event.target.value})
  }

  onSubmitSuccess = token => {
    const {history} = this.props

    Cookies.set('jwt_token', token, {
      expires: 30,
    })
    const tokens = Cookies.get('jwt_token')
    console.log(tokens)
    history.replace('/tasks')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {assignee, assignor, title, description, status} = this.state

    const userDetails = {assignee, assignor, title, description, status}

    const url = 'https://assignment-3ooo.onrender.com/task'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(userDetails), // Stringify the object as JSON
    }

    try {
      const response = await fetch(url, options)

      const data = await response.json()
      this.setState({showAddTask: false})
      if (response.ok === true) {
        this.getTasks()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  onAddTaskEnable = () => {
    this.setState({showAddTask: true})
  }

  onLogout = () => {
    const {history} = this.props

    Cookies.remove('jwt_token')
    history.replace('/')
  }

  render() {
    const {
      title,
      description,
      status,
      assignee,
      assignor,
      showAddTask,
      tasks,
    } = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return <Redirect to="/" />
    }
    return (
      <>
        <div className="task-container">
          <ul className="header-container">
            <li>
              <p className="title">Task Manager</p>
            </li>
            <li>
              <button
                className="add-task-button"
                onClick={this.onAddTaskEnable}
                type="button"
              >
                Add Task
              </button>
            </li>
            <li className="search-bar">
              <input type="search" className="search" />
              <img
                src="https://img.freepik.com/free-photo/search-icon-front-side-with-white-background_187299-39962.jpg"
                className="tasks-profile"
              />
            </li>

            <li>
              <Link to="/settings" className="link">
                <img
                  src="https://img.freepik.com/free-photo/gear-front-side-white-background_187299-40157.jpg"
                  className="tasks-profile"
                />
              </Link>
            </li>
            <li>
              <Link to="/profile" className="link">
                <img
                  alt="profile"
                  src="https://img.freepik.com/free-photo/user-profile-icon-front-side-with-white-background_187299-40010.jpg"
                  className="tasks-profile"
                />
              </Link>
            </li>
            <li>
              <button onClick={this.onLogout}>Logout</button>
            </li>
          </ul>
        </div>
        <div className="tasks">
          {showAddTask && (
            <form className="task-form-container" onSubmit={this.submitForm}>
              <div className="input-container">{this.rendertitleField()}</div>
              <div className="input-container">
                {this.renderdescriptionField()}
              </div>
              <div className="input-container">{this.renderstatusField()}</div>
              <div className="input-container">
                {this.renderassigneeField()}
              </div>
              <div className="input-container">
                {this.renderassignorField()}
              </div>

              <button type="submit" className="login-button">
                Add
              </button>
            </form>
          )}

          <h1 className="todo-title">Tasks Todo </h1>
          <ul className="tasks-todo-continer">
            {tasks.map(each => (
              <li className={`todo ${each.status}`}>
                <p>Task Title : {each.title}</p>
                <p>Assignor : {each.assignor}</p>
                <p>Assignee : {each.assignee}</p>
                <p>Status : {each.status}</p>
                <label htmlFor="change">Change Status</label>
                <select id={each.id} onChange={this.onStatusChange}>
                  <option value={each.id}>PENDING</option>
                  <option value={each.id}>IN PROGRESS</option>
                  <option value={each.id}>COMPLETED</option>
                </select>

                <img
                  className="delete"
                  src="https://img.freepik.com/free-psd/phone-icon-design_23-2151311654.jpg"
                />
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default Tasks
