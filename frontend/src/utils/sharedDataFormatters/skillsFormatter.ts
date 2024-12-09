import {SelectProps} from "antd";

let skills = ['Django', 'Javascript', 'Python', 'Php', 'Postgres', 'Sql', 'Html', 'Css', 'Bootstrap', 'React', 'Java', 'ReactNative', 'Redux', 'Flask', 'Go', 'Expressjs', 'Vuejs',
    'Angular', 'Ios', 'Flutter', 'Ionic', 'C', 'Swift', 'Nodejs', 'Typescript', 'Firebase', 'Xamarin', 'Spark', '.Net', 'Redis', 'Sqlite', 'Rails', 'Meteor', 'AI', 'Cybersecurity',
    'Blockchain', 'Arduino', 'Spring', 'Bitcoin', 'Kotlin', 'Scala', 'Nativescript', 'Android', 'Figma', 'Photoshop', 'Adobexd', 'UI/UX', 'DevOps']
const SkillOptions: SelectProps['options'] = [];

skills.forEach(skill=>{
    SkillOptions.push({
        value: skill,
        label: skill,
    });
})
export default SkillOptions;