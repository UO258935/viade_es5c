import styled from 'styled-components';
import {media} from '@utils';

export const RouteWrapper = styled.section`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  background-image: url('img/concentric-hex-pattern_2x.png');
  background-repeat: repeat;
  padding: 60px 0;
  
  h1 {
    color: white;
      font-weight: bold;
      font : Verdana;
  }
`;
export const RouteContainer = styled.div`
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  background-color: white;
  max-width: 90%;
  margin: 0 20px;
  width: 100%;
  flex: 1 0 auto;
   h1 {
    color: black;
      font-weight: bold;
      font : Verdana;
  }
`;

export const Header = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-image: url('img/pattern-geo.png'),
  linear-gradient(135deg, #B05103 0%, #FD7200 50%, #F48E3C 100%);
  background-repeat: repeat, no-repeat;
  padding: 30px 20px;
   h1 {
    color: white;
      font-weight: bold;
      font : Verdana;
  }
`;

export const Input = styled.input`
  margin: 5px;
`;

export const Form = styled.form`
  padding: 20px 40px;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px 40px;
  ${media.tablet`
    grid-template-columns: 1fr 1fr;
  `}
`;

export const Button = styled.button`
  max-width: 128px;
  display: inline-block;

  &:first-child {
    margin-right: 10px;
  }
`;