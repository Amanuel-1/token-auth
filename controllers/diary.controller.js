

const createDiary = async (req, res) => {
    try {
        const { title, content } = req.body;
        const user_id = req.user.id;
    
        const newDiary = await db.diary.create({
        data: {
            title,
            content,
            user_id,
        },
        });
    
        return res.status(201).json({ message: "Diary created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}