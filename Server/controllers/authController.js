const User = require('../models/User');

const loginUser = async (req, res) => {
    console.log('BODY RECEIVED:', req.body);

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ success: true, user: { username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginUser };