import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import sb from 'react-native-style-block';
import { TIcon } from '../components/TComponent';
import ContactsList from '../components/ContactsList';
import { useNavigation } from '@react-navigation/native';
import { TMemo } from '@shared/components/TMemo';

const ContactsScreen: React.FC = TMemo(() => {
  const navigation = useNavigation();
  const handlePressAddFriend = useCallback(() => {
    navigation.dangerouslyGetParent().navigate('AddFriend');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handlePressAddFriend}>
          <View style={styles.iconBtnView}>
            <TIcon
              style={[...styles.icon, sb.bgColor('#16a085')]}
              icon="&#xe61d;"
            />
            <Text>寻找基友/姬友/团</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <ContactsList />
      </View>
    </View>
  );
});
ContactsScreen.displayName = 'ContactsScreen';

const styles = {
  container: [sb.flex()],
  header: [
    sb.direction(),
    // sb.padding(10, 0),
    sb.bgColor(),
    { marginBottom: 10 },
  ],
  iconBtn: [sb.flex(), sb.margin(10, 0), sb.padding(0, 20)],
  iconBtnView: [sb.direction(), sb.alignCenter()],
  icon: [
    {
      color: 'white',
      fontFamily: 'iconfont',
      fontSize: 20,
      textAlign: 'center',
      lineHeight: 40,
    },
    sb.size(40, 40),
    sb.radius(3),
    sb.margin(0, 10, 0, 0),
  ],
  list: [sb.flex()],
};

export default ContactsScreen;
