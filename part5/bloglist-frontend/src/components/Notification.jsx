const Notification = ({ notification }) => {
  if (notification.text === null) {
    return null
  }

  const styles = {
    success: {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    },
    error: {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px'
    }
  }

  return <div style={styles[notification.type]}>{`${notification.text}`}</div>
}

export default Notification
