import UserM from '../../tinyUrl/Models/userM.js';
//postmanועובד כשורה  הכל נבדק ב
const UserController = {
  get: async (req, res) => {
    try {
      // מציאת כל המשתמשים במסד הנתונים
      const users = await UserM.find();
      // שליחת התוצאה ללקוח
      res.status(200).json(users);
    } catch (error) {
      // טיפול בשגיאות ושליחת הודעת שגיאה ללקוח
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
        await UserM.find({_id:req.params.id})
      const user = await UserM.findById(req.params.id);//שליפה לפי מזהה
      res.json(user);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  add: async (req, res) => {
    try {
      // בדיקת הנתונים שנשלחו בבקשה
      const { name, email, password } = req.body;

      // בדיקת קיום של שדות חובה
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      // יצירת אובייקט משתמש חדש
      const newUser = new UserM({
        name,
        email,
        password,
        links: []
      });

      // שמירת המשתמש החדש במסד הנתונים
      const savedUser = await newUser.save();

      // החזרת תשובה ללקוח עם פרטי המשתמש שנוצר
      res.status(201).json(savedUser);
    } catch (error) {
      // טיפול בשגיאות ושליחת הודעת שגיאה ללקוח
      if (error.code === 11000) {
        res.status(400).json({ message: 'Email already exists.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    try {
      const updateduser = await UserM.findByIdAndUpdate(id, req.body, {new:true});//עדכון לפי מזהה
      res.json(updateduser);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await UserM.findByIdAndDelete(id);//מחיקה לפי מזהה
      res.json(deleted);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

};





export default UserController;