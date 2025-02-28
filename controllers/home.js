const User = require("../models/User");
const Todo = require("../models/Todo");

module.exports = {
  getIndex: async (req, res) => {
    try {

      if (req.user) {
        let today  = new Date();
        let todayDate = today.toISOString().slice(0, 10)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        let todosOther = await Todo.find( {cleaningArea: "other", user: req.user.id, dueDate: todayDate} ).lean()
        let todosBedroom = await Todo.find( {cleaningArea: "bedroom", user: req.user.id, dueDate: todayDate} ).lean()
        let todosBathroom = await Todo.find( {cleaningArea: "bathroom", user: req.user.id, dueDate: todayDate} ).lean()
        let todosLiving = await Todo.find( {cleaningArea: "living room", user: req.user.id, dueDate: todayDate} ).lean()
        let todosDining = await Todo.find( {cleaningArea: "dining room", user: req.user.id, dueDate: todayDate} ).lean()
        let todosKitchen = await Todo.find( {cleaningArea: "kitchen", user: req.user.id, dueDate: todayDate} ).lean()

        const cleaningArea = ["bedroom", "bathroom", "kitchen", "living room", "dining room", "other"]
        const lists = [todosBedroom, todosBathroom, todosKitchen, todosLiving, todosDining, todosOther]

        console.log(todosDining)
        res.render("home.ejs", { 
          user: req.user,
          date: today.toLocaleDateString("en-US", options),
          cleaningArea: cleaningArea,
          lists: lists
        })
        return;
      }

      res.render("index.ejs")
    } catch (err) {
      console.log(err);
    }
  },
  getSearch: async (req, res) => {
    try {
      let search = req.query.search
      const posts = await Post.find({
        $text: {
          $search: search,
          $caseSensitive: false,
        }})
     
      console.log(posts)

      res.render('search.ejs', { posts: posts, search: search });
     
    } catch (err) {
      console.log(err);
    }
  }
};
