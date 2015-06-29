import $ from 'jquery';

export default function sendMail({to, subject, body}) {
	return Promise.resolve($.post('/mail', {to, subject, body}))
		.catch(xhr => {
			var json = xhr.responseJSON;
			if(json.status === 'fail'){
				return Promise.reject(Object.keys(json.data).map(key => json.data[key]).join(', '));
			}
			return Promise.reject(json.message);
		});
}
