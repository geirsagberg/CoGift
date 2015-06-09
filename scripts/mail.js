import reqwest from 'reqwest';

export default function sendMail({to, subject, body}) {
	return reqwest({
		url: 'mail',
		method: 'post',
		data: {to, subject, text: body}
	});
}
