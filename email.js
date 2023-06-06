import sgMail from '@sendgrid/mail';

sgMail.setApiKey("***REMOVED***");




const sendEmail = (email, refundRequestId, status, totalPrice) => {
  return sgMail.send({
      to: email,
      from: 'giurabbitmart@gmail.com',
      subject: `Refund Request ${status}`,
      text: `Your refund request has been ${status}.\nRefund Request Id:  ${refundRequestId}\nTotal Price: ${totalPrice}`
    });
}

export default{
  sendEmail
}