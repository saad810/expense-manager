import Email from "../models/email.model.js";

export const hasEmailBeenSentToday = async (to, reason) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const email = await Email.findOne({
        'emailData.to': to,
        reason,
        time: { $gte: startOfDay, $lte: endOfDay },
    });

    return !!email; // true if found, false if not
};