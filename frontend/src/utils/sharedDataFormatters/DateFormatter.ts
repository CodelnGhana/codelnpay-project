import moment from 'moment';
function DateFormatter(date:string){
    return moment(date).format('MMMM Do YYYY');
}
export default DateFormatter;