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
};

const getDiaryById = async (req, res) => {
    try {
        const { id } = req.params;

        const diary = await db.diary.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!diary) {
            return res.status(404).json({ message: "Diary not found" });
        }

        return res.status(200).json(diary);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateDiary = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updatedDiary = await db.diary.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title,
                content,
            },
        });

        if (!updatedDiary) {
            return res.status(404).json({ message: "Diary not found" });
        }

        return res.status(200).json({ message: "Diary updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteDiary = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDiary = await db.diary.delete({
            where: {
                id: parseInt(id),
            },
        });

        if (!deletedDiary) {
            return res.status(404).json({ message: "Diary not found" });
        }

        return res.status(200).json({ message: "Diary deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createDiary,
    getDiaryById,
    updateDiary,
    deleteDiary,
};
