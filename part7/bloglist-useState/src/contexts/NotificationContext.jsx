import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

export const useNotification = () => {
  return useContext(NotificationContext)
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return { type: action.payload.type, text: action.payload.text }
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, {})

  let timeout

  const showNotification = (text, type) => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: { text, type } })

    timeout = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
