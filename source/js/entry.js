console.log('you in the hizzy');
console.log('you in the hizzy again');

import checkName from './modules/logger';

checkName('nader', 'dabit');
console.log('<testy>testyasd again and again asd testya booya</testy>');
//



import Modernizr from 'modernizr';
 
if (!Modernizr.canvas) {
	console.log('We\'ve got canvas');
} else {
	console.log('no canvas');
}