import Joi from "joi";

// const createContact = async (req, res ,next) => {
//     const data = await Joi.object({
//         name: Joi.string().trim().min(3).max(50).required(),
//         email: Joi.string().trim().email().required(),
//         phone: Joi.alternatives().try(
//             Joi.string().pattern(/^\+?[0-9]{10,15}$/), // Beynəlxalq format
//             Joi.string().pattern(/^[0-9]{10}$/)       // Yalnız 10 rəqəm
//         ).required(),
//         message: Joi.string().trim().min(3).max(200).required(),
//     }).validateAsync(req.body, { abortEarly: false })
//         .catch(err => {
//         return res.status(422).json({
//             message: "Xeta bash verdi!",
//             error: err.details.map(item => item.message)
//         })
//     })
//     const existEmail = await Contact.findOne({ email: data.email });
//     if (!existEmail) {
//         return res.status(409).json({
//             message: "Bu emaile artiq user  movcud deyil!"
//         })
//     }
//     const newMessage = new Contact.create({
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         message: data.message
//     }).then(newMessage => res.status(201).json(newMessage))
//     .catch(err => res.status(500).json({
//         message: "Xeta bash verdi!",
//         error: err.message
//     }))

// }

const createContact = async (req, res ,next) => {
    try {
        const schema = Joi.object({
            name: Joi.string().trim().min(3).max(50).required(),
            email: Joi.string().trim().email().required(),
            phone: Joi.alternatives().try(
                Joi.string().trim().pattern(/^\+?[0-9]{10,15}$/).messages({
                    "string.pattern.base": "Telefon beynəlxalq formatda olmalıdır (+1234567890)."
                }),
                Joi.string().trim().pattern(/^[0-9]{10}$/).messages({
                    "string.pattern.base": "Telefon yalnız 10 rəqəm olmalıdır (1234567890)."
                })
            ).required(),
            message: Joi.string().trim().min(3).max(200).required(),
        });

        const data = await schema.validateAsync(req.body, { abortEarly: false });

        // Check if email already exists
        const existEmail = await Contact.findOne({ email: data.email });
        if (existEmail) {
            return res.status(409).json({
                message: "Bu email ilə artıq istifadəçi mövcuddur!"
            });
        }

        // Create new message
        const newMessage = await Contact.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message
        });
        return res.status(201).json(newMessage);

    } catch (err) {
        if (err.isJoi) {
            return res.status(422).json({
                message: "Xəta baş verdi!",
                error: err.details.map(item => item.message)
            });
        }
        return res.status(500).json({
            message: "Daxili server xətası!",
            error: err.message
        });
    }
};


const allMessages  = async(req,res,next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const allMessages = await Contact.countDocuments();

        if (allMessages === 0) {
            return res.status(404).json({
                message: "Mesaj yoxdur!"
            })
        }

        const before_page = (page-1)*limit;
        const list = await Contact.find().skip(before_page).limit(limit);
        res.status(200).json({
            allMessages,
            currentPage: page,
            messagesCurrentPage: list.length,
            allpages: Math.ceil(allMessages/limit),
        })
    } catch (error) {
        res.status(500).json({
            message: "Xeta SErverde  bash verdi!",
            error: error.message
        })
    }
}


const getMessages = async(req,res,next) => {
    try {
        const id = req.params.id;
        const message = await Contact.findById(id);
        if (!message) {
            return res.status(404).json({
                message: "Mesaj tapilmadi!"
            })
        }
        res.status(200).json(message)

    } catch (error) {
        res.status(500).json({
            message: "Xeta bash verdi!",
            error: error.message
        })  
    }
}



export const contactController = () => ({
    createContact,
    allMessages,
    getMessages                       
})

