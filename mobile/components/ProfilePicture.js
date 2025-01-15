import { Image, StyleSheet } from 'react-native';

export default function ProfilePicture(props) {

    return (
        <Image
            style={styles.smalleProfilePicture}
            src={props.src} 
            width={props.width}
            height={props.height} />
    );
};

const styles = StyleSheet.create({
    smalleProfilePicture: {
        width: 50,
        height: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 25
    }
});