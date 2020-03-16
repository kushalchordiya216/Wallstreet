const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Wallstreet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set('useFindAndModify', false);