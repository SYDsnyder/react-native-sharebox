/**
 * 分享组件
 */
import React from 'react';
import { View,Text, Image, TouchableOpacity, Modal } from 'react-native';
import PropTypes from 'prop-types';

import * as WeChat from 'react-native-wechat';
import {Toast} from "@ant-design/react-native";


export default class ShareBox extends React.PureComponent {

    static propTypes = {
      appId: PropTypes.string.isRequired,
      weixin: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        thumbImage: PropTypes.string.isRequired,
        webpageUrl: PropTypes.string.isRequired,
      }),
      pengyou: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        thumbImage: PropTypes.string.isRequired,
        webpageUrl: PropTypes.string.isRequired,
      }),

    };

    static defaultProps = {
    };

    constructor(props) {
      super(props);

      const { weixin, pengyou } = props;
      this.itemList = [];
      this.ishow = false;

      weixin && this.itemList.push({ title:'微信好友',page:'weixin', icon: Theme.commonImages.shareBoxIcon.wx });
      pengyou && this.itemList.push({ title:'朋友圈',page:'pengyou', icon: Theme.commonImages.shareBoxIcon.wxq });

    }

    componentDidMount(){
      WeChat.registerApp(this.props.appId);
    }

    onItemSelected(item) {

      const { weixin, pengyou } = this.props;

      WeChat.isWXAppInstalled().then((isInstalled) => {
        if (isInstalled) {
          if (item.page === 'weixin' && !!weixin) {
            WeChat.shareToSession({
              type: 'news',
              title: weixin.title, // WeChat app treat title as file name
              description: weixin.description,
              mediaTagName: 'word file',
              thumbImage: weixin.thumbImage,
              webpageUrl: weixin.webpageUrl,
            }).catch((error) => {
                Toast.show(error.message);
            });
          } else if (item.page === 'pengyou' && !!pengyou) {
            WeChat.shareToTimeline({
              type: 'news',
              title: pengyou.title, // WeChat app treat title as file name
              description: pengyou.description,
              mediaTagName: 'word file',
              thumbImage: pengyou.thumbImage,
              webpageUrl: pengyou.webpageUrl,
            });
          }
        } else {
            Toast.show('没有安装微信软件，请您安装微信之后再试');
        }
      }).catch(error => Toast.show(error));

    }

    render() {

      const { children } = this.props;

      return (
          <View>
              <TouchableOpacity onPress={() => this.ishow = true}>
                  {children}
              </TouchableOpacity>
              <Modal animationType="none" transparent={true} visible={this.ishow} onRequestClose={() => {this.ishow = false}}>
                  <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'flex-end'}}>
                      <View style={{ width: '100%', height: 260, backgroundColor: '#FFFFFF', marginVertical: Theme.pagePaddingVertical,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                          {this.itemList.map((item, index) => <ShareItem key={index} item={item} onItemSelected={() => this.onItemSelected && this.onItemSelected(item)}/>)}
                      </View>
                  </View>
              </Modal>
          </View>
      );
    }
}

// const SharePullView = (itemList, onItemSelected) => (
//   <Overlay.PullView side="bottom" modal={false} ref={v => this.overlayView = v}
//     containerStyle={{ backgroundColor: Theme.defaultViewBgColor, marginHorizontal: '10%', transform: [{ translateY: -50 }],
//       borderRadius: 10 }}
//   >
//     <View style={{ marginVertical: Theme.pagePaddingVertical,flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
//       {itemList.map((item, index) => <ShareItem key={index} item={item} onItemSelected={() => onItemSelected && onItemSelected(item)}/>)}
//     </View>
//   </Overlay.PullView>
// );
//

const ShareItem = props => {
  const { item, onItemSelected } = props;
  return (
    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => onItemSelected && onItemSelected()}>
      <View style={{ height: 50, width: 50, justifyContent: 'center',alignItems: 'center' }}>
        <Image style={ { width: 32, height: 32, borderRadius: 16 } } resizeMode="stretch" source={ item.icon } />
      </View>
      <View>
        <Text style={{ fontSize: 13, paddingTop: 10, color:'#4A4A4A' }}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};
