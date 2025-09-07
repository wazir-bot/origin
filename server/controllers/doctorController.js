const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

// ✅ Get all doctors
const getalldoctors = async (req, res) => {
  try {
    let docs;
    if (!req.locals) {
      docs = await Doctor.findAll({
        where: { isDoctor: true },
        include: [{ model: User, as: "user" }],
      });
    } else {
      docs = await Doctor.findAll({
        where: {
          isDoctor: true,
          userId: { [require("sequelize").Op.ne]: req.locals },
        },
        include: [{ model: User, as: "user" }],
      });
    }
    return res.json(docs);
  } catch (error) {
    res.status(500).send("Unable to get doctors");
  }
};

// ✅ Get non-doctors
const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.findAll({
      where: {
        isDoctor: false,
        userId: { [require("sequelize").Op.ne]: req.locals },
      },
      include: [{ model: User, as: "user" }],
    });
    return res.json(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

// ✅ Apply for doctor
const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({
      where: { userId: req.locals },
    });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    await Doctor.create({ ...req.body.formDetails, userId: req.locals });

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    res.status(500).send("Unable to submit application");
  }
};

// ✅ Accept doctor application
const acceptdoctor = async (req, res) => {
  try {
    await User.update(
      { isDoctor: true, status: "accepted" },
      { where: { id: req.body.id } }
    );

    await Doctor.update(
      { isDoctor: true },
      { where: { userId: req.body.id } }
    );

    await Notification.create({
      userId: req.body.id,
      content: "Congratulations, Your application has been accepted.",
    });

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

// ✅ Reject doctor application
const rejectdoctor = async (req, res) => {
  try {
    await User.update(
      { isDoctor: false, status: "rejected" },
      { where: { id: req.body.id } }
    );

    await Doctor.destroy({ where: { userId: req.body.id } });

    await Notification.create({
      userId: req.body.id,
      content: "Sorry, Your application has been rejected.",
    });

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

// ✅ Delete doctor
const deletedoctor = async (req, res) => {
  try {
    await User.update(
      { isDoctor: false },
      { where: { id: req.body.userId } }
    );

    await Doctor.destroy({ where: { userId: req.body.userId } });
    await Appointment.destroy({ where: { userId: req.body.userId } });

    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete doctor");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
