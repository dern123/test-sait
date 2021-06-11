process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const express = require('express'); //needed to launch server
const cors = require('cors'); //needed to disable sendgrid security
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express(); //alias from the express function
var _jade = require('jade');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//utilize Cors so the browser doesn't restrict data, without it Sendgrid will not send!

//sendgrid api key
async function main(data) {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	// let testAccount = await nodemailer.createTestAccount();

	// create reusable transporter object using the default SMTP transport
	// let transporter = nodemailer.createTransport({
	// 	host: 'smtp.ethereal.email',
	// 	port: 587,
	// 	secure: false, // true for 465, false for other ports
	// 	auth: {
	// 		user: testAccount.user, // generated ethereal user
	// 		pass: testAccount.pass, // generated ethereal password
	// 		// user: 'imperor.oktov@gmail.com',
	// 		// pass: '909080Dasha',
	// 	},
	// });
	let smtpTransport = nodemailer.createTransport({
		service: 'Gmail',
		port: 465,
		auth: {
			user: 'imperor.oktov@gmail.com',
			pass: '909080Dasha',
		},
	});

	// send mail with defined transport object
	let info = await smtpTransport.sendMail({
		from: 'imperor.oktov@gmail.com',
		// 'imperor.oktov@gmail.com',
		// '"Fred Foo 👻" <foo@example.com>', // sender address
		to: data.email, // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: `
'<b>Hello world?</b>'
	         <h3>Informations</h3>
	         <ul>
	         <li>Name:${data.name}</li>
	         <li> Last Name:${data.lastName}</li>
	         <li>Email:${data.email}</li>
	        <li>Tel:${data.tel}</li>
	        </ul>

	         `, // html body
	});
	smtpTransport.sendMail(info, (error, res) => {
		if (error) {
			console.log(res);
			// res.send(error);
		} else {
			res.send('Success');
		}
	});
	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

app.use(express.static(__dirname + '/public'));
// Welcome page of the express server:
app.get('/', (req, res) => {
	res.send('Welcome to the Sendgrid Emailing Server');
});

app.post('/api/forma', (req, res) => {
	console.log('res.data', res.req.body);

	let data = res.req.body;
	main(data).catch(console.error);

	// let smtpTransport = nodemailer.createTransport({
	// 	service: 'Gmail',
	// 	// port: 465,
	// 	auth: {
	// 		user: 'imperor.oktov@gmail.com',
	// 		pass: '909080Dasha',
	// 	},
	// });
	// var sendMail = function (toAddress, subject, content, next) {
	// 	let mailOptions = {
	// 		from: 'SENDERS NAME <' + FROM_ADDRESS + '>',
	// 		to: 'imperor.oktov@gmail.com',
	// 		subject: `Message from ${data.name}`,
	// 		html: `

	//         <h3>Informations</h3>
	//         <ul>
	//         <li>Name:${data.name}</li>
	//         <li> Last Name:${data.lastName}</li>
	//         <li>Email:${data.email}</li>
	//         <li>Tel:${data.tel}</li>
	//         </ul>

	//         `,
	// 	};

	// 	smtpTransport.sendMail(mailOptions, next);
	// };

	// exports.index = function (req, res) {
	// 	// res.render('index', { title: 'Express' });

	// 	// specify jade template to load
	// 	var template = process.cwd() + '/views/index.jade';

	// 	// get template from file system
	// 	fs.readFile(template, 'utf8', function (err, file) {
	// 		if (err) {
	// 			//handle errors
	// 			console.log('ERROR!');
	// 			return res.send('ERROR!');
	// 		} else {
	// 			//compile jade template into function
	// 			var compiledTmpl = _jade.compile(file, { filename: template });
	// 			// set context to be used in template
	// 			var context = { title: 'Express' };
	// 			// get html back as a string with the context applied;
	// 			var html = compiledTmpl(context);

	// 			sendMail(TO_ADDRESS, 'test', html, function (err, response) {
	// 				if (err) {
	// 					console.log('ERROR!');
	// 					return res.send('ERROR');
	// 				}
	// 				res.send('Email sent!');
	// 			});
	// 		}
	// 	});
	// };

	// smtpTransport.sendMail(mailOptions, next);
	// (error, res) => {
	// 	if (error) {
	// 		console.log(res);
	// 		// res.send(error);
	// 	} else {
	// 		res.send('Success');
	// 	}
	// });
	// smtpTransport.close();
});

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
