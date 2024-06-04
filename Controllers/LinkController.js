import LinkM from '../../tinyUrl/Models/linkM.js';
import userM from '../Models/userM.js';
const LinkController = {
  get: async (req, res) => {
    try {
      // מציאת כל המשתמשים במסד הנתונים
      const links = await LinkM.find();
      // שליחת התוצאה ללקוח
      res.status(200).json(links);
    } catch (error) {
      // טיפול בשגיאות ושליחת הודעת שגיאה ללקוח
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      await LinkM.find({ _id: req.params.id })
      const link = await LinkM.findById(req.params.id);//שליפה לפי מזהה
      res.json(link);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  add: async (req, res) => {
    const { originalUrl, userId, targetParamName, targetValues } = req.body;
    try {
      // יצירת קישור חדש
      const newLink = await LinkM.create({ originalUrl, userId, targetParamName, targetValues });

      // עדכון המשתמש בהוספת הקישור החדש למערך הקישורים שלו
      const user = await userM.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.links.push(newLink._id);  // הוספת ה-ID של הקישור החדש
      await user.save();  // שמירת המשתמש עם העדכון

      // שליחת הקישור החדש כתגובה
      res.json(newLink);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  ,
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const updatedlink = await LinkM.findByIdAndUpdate(id, req.body, { new: true });//עדכון לפי מזהה
      res.json(updatedlink);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await LinkM.findByIdAndDelete(id);//מחיקה לפי מזהה
      res.json(deleted);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
  redirectToOriginalUrl: async (req, res, ipAddress) => {
    try {
      const link = await LinkM.findById(req.params.id);

      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      // בדיקה האם ישנו פרמטר בשם של targetParamName ב-Query String
      const targetParamName = link.targetParamName; // אם אין ערך מוגדר, נשתמש בשם 'target' כברירת מחדל
      const targetParam = req.query[targetParamName];
      console.log(link.originalUrl)
      if (targetParam) {
        // אם קיים, נוסיף את הפרמטר לקליק החדש
        link.clicks.push({ ipAddress, targetParamValue: targetParam });
      } else {
        // אם אין פרמטר בשם המתאים, נוסיף קליק רגיל ללא ערך targetParamValue
        link.clicks.push({ ipAddress });
      }

      await link.save(); // שמירת השינויים במסד הנתונים

      // הפניה מחדש לקישור המקורי
      res.redirect(link.originalUrl);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  getLinkClicks: async (req, res) => {
    try {
      const link = await LinkM.findById(req.params.id);

      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }

      const targetClicks = link.clicks.reduce((acc, click) => {
        if (click.targetParamValue) {
          acc[click.targetParamValue] = (acc[click.targetParamValue] || 0) + 1;
        }
        return acc;
      }, {});

      const targetValues = link.targetValues.map(target => ({
        name: target.name,
        value: target.value,
        clickCount: targetClicks[target.value] || 0
      }));

      res.json({ targetValues });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};


export default LinkController;