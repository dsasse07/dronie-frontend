import { createConsumer } from '@rails/actioncable'

const consumer = createConsumer(`${process.env.REACT_APP_SOCKET}/cable`)

export default consumer