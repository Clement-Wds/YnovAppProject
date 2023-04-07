import React from 'react';
import {TouchableOpacity, View, Modal} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Header = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  const [showLanguagePopup, setShowLanguagePopup] = React.useState(false);

  const switchLanguage = newLanguage => {
    i18n.changeLanguage(newLanguage);
    setShowLanguagePopup(false);
  };

  return (
    <Container>
      <LeftContainer>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Greeting>{t('resources.header.title')}</Greeting>
        </TouchableOpacity>
      </LeftContainer>
      <RightContainer>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Logo source={require('../../assets/user.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Logo source={require('../../assets/history.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLanguagePopup(true)}>
          <Logo source={require('../../assets/languages.png')} />
        </TouchableOpacity>
      </RightContainer>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguagePopup}
        onRequestClose={() => setShowLanguagePopup(false)}>
        <PopupContainer>
          <PopupTitle>{t('resources.header.chooseLanguage')}</PopupTitle>
          <LanguageButton onPress={() => switchLanguage('en')}>
            <ButtonText>English</ButtonText>
          </LanguageButton>
          <LanguageButton onPress={() => switchLanguage('fr')}>
            <ButtonText>Français</ButtonText>
          </LanguageButton>
          <LanguageButton onPress={() => switchLanguage('es')}>
            <ButtonText>Español</ButtonText>
          </LanguageButton>
          <CloseButtonContainer>
            <CloseButton onPress={() => setShowLanguagePopup(false)}>
              <CloseIcon source={require('../../assets/close.png')} />
            </CloseButton>
          </CloseButtonContainer>
        </PopupContainer>
      </Modal>
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${props => props.theme.colors.main};
  elevation: 5;
  z-index: 1;
  width: 100%;
`;

const Logo = styled.Image`
  width: 24px;
  height: 24px;
`;

const LeftContainer = styled.View`
  flex: 1;
`;

const RightContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80px;
`;

const Greeting = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
  color: ${props => props.theme.text.dark};
`;

const PopupContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: auto;
  max-height: 300px;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
`;

const PopupTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const LanguageButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.main};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.text.dark};
`;

const CloseButtonContainer = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
`;

const CloseIcon = styled.Image`
  width: 20px;
  height: 20px;
`;
export default Header;
