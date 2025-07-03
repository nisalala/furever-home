export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.params.id;
    const { preferences } = req.body;

    console.log("Incoming preferences:", preferences);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateUserPreferences:", error);
    res.status(500).json({ error: "Server error" });
  }
};
