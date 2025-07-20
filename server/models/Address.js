import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    },
});

const Address = mongoose.model("Address", AddressSchema);

export default Address;