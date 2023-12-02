import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import { PORT } from './src/utils/const.js'
import appRoutes from './src/routes/index.js'
import connectDB from './src/services/connect.js'
import runJobs from './src/jobs/index.js'

const app = express()

// Middlewawre

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://may-shopping.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/api', appRoutes)

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

connectDB()

runJobs()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

process.on('unhandledRejection', (err) => {
    console.error(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})

export default app
