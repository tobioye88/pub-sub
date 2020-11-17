const express = require('express')
const axios = require('axios').default;
const bodyParser = require('body-parser')
const app = express()
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let subscribers = [
    // {
    //     "topic": "topic1",
    //     "subs": [
    //         {
    //             "url": "http://localhost:8000/event"
    //         }
    //     ]
    // }
];

app.get('/', (req, res) => {
//   res.send('Hello World!')
    res.json(subscribers)
})

app.post('/subscribe/:topic', (req, res) => {
    // console.log('/subscribe/{TOPIC}')
    const indexFound = subscribers.findIndex(item => item.topic === req.params.topic)
    if(indexFound === -1){
        subscribers.push({ topic: req.params.topic, subs: [ req.body ] })
    }else{
        subscribers[indexFound].subs.push(req.body)
    }
    res.json({ success: true, message: "Successfully subscribed" })
})

app.post('/publish/:topic', (req, res) => {
    // console.log('/publish/{TOPIC}')
    const topic = req.params.topic
    const subscription = subscribers.filter((el) => el.topic == topic)
    
    if(subscription.length == 0){
        res.status(401).json({ success: false, message: "There are no subscriptions available" })
    }
    if(!subscription){
        res.status(401).json({ success: false, message: "Failed to publish message" })
    }
    
    console.log(subscription)
    
    const subs = subscription[0].subs
    subs.forEach(item => {
        // console.log(item.url)
        const data = { topic, message: req.body.message }
        const destinationUrl = 'http://localhost:8000'
        axios.post(destinationUrl, data).then(response => {
            console.log(response)
        }).catch(reason => {
            console.log(reason)
        })
    })
    
    res.json({ success: true, message: "Successfully published message" })
})

app.post('event', (req, res) => {
    res.json(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})