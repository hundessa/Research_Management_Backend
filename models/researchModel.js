import mongoose from 'mongoose'

const researchModel = new mongoose.Schema({
    researchTitle: {
        type: String,
        required: true
    },
    researchType: {
        type: String,
        enum: ['Normal Research', 'Community Engagement'],
        required: true
    },
    researchFile: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'reviewed', 'underdefence', 'finalized', 'accepted', 'rejected']
    }
});

export default mongoose.Schema("Research", researchModel);