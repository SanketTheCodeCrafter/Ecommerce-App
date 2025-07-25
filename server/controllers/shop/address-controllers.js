import Address from "../../models/Address.js";

export const addAddress = async (req, res) => {

    try {
        const { userId, address, city, pincode, phone, notes } = req.body;
        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newAddress = new Address({
            userId, address, city, pincode, phone, notes
        });

        await newAddress.save();

        res.status(200).json({
            success: true,
            data: newAddress,
            message: "Address added successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in adding address"
        })
    }
}
export const fetchAllAddress = async (req, res) => {

    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required!",
            });
        }

        const addressList = await Address.find({ userId });

        res.status(200).json({
            success: true,
            data: addressList,
            message: "Address fetched successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in fetching address"
        })
    }
}

export const editAddress = async (req, res) => {

    try {
        const { userId, addressId } = req.params;
        const updateFields = req.body;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id are required!",
            });
        }
        const address = await Address.findOneAndUpdate({
            _id: addressId,
            userId,
        }, updateFields, { new: true });

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address not found!",
            })
        }

        res.status(200).json({
            success: true,
            data: address,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in updating address"
        })
    }
}

export const deleteAddress = async (req, res) => {

    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User and address id are required!",
            });
        }

        const address = await Address.findOneAndDelete({
            _id: addressId, userId
        });

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Address not found!",
            });
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in deleting address"
        })
    }
}