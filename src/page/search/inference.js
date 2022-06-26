import React from 'react';
import './search.css';
import ContentSearch from './ContentSearch.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { searchInference } from '@core/utils/api/api';
import { Space40, Space60, Space120 } from '@core/components/atom/space/space';
import { Spinner } from 'react-bootstrap';

export default class Inference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      number: 4,
      data: [],
      percent: 0,
      tracking: false,
      isSearch: false,
      disable: true,
      error: false,
    };
  }

  componentDidMount() {
    AOS.init({
      once: true
    });
    document.title = 'InfoCheck | Relevance';
  }

  render() {
    const { text, data, isSearch, error } = this.state;
    return (
      <div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__title'>
          <div className='title__layout'>
            <h1 className='highlight-color'>Relevance Documents</h1>
          </div>
        </div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__description'>
        </div>
        <Space40></Space40>
        <div
          data-aos='fade-right'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='600'
          className='search'>
          <div className='search__layout'>
            <input
              className='input-search'
              id='input-search'
              placeholder='Nhập thông tin cần tìm kiếm'
              onChange={async (event) => {
                await this.setState({ text: event.target.value });
                if (text.length > 0) {
                  await this.setState({ disable: false });
                } else {
                  this.setState({ disable: true });
                }
              }}
            />
            <button
              className='btn-search'
              // disabled={disable}
              onClick={async () => {

                if (text.length === 0) {
                  this.setState({ error: true });
                  return;
                }
                this.setState({ isSearch: true });
                let bodyFormData = new FormData();
                bodyFormData.append('data', text);
                const res = await searchInference(bodyFormData);
                console.log(res);
                if (!res.data["re-ranking"].documents) {
                  this.setState({ error: true });
                  this.setState({ isSearch: false });
                  return;
                }
                await this.setState({ data: res.data["re-ranking"].documents });
                await this.setState({ isSearch: false });
                await this.setState({ disable: true });
                document.getElementById('input-search').value = '';
              }}
            >
              <div className='btn-search__layout'>
                <div className='txt-search'>Tìm kiếm</div>
                {isSearch ?
                  <Spinner animation='border' role='status' size='sm' variant='light' className='spinner-custom'>
                    <span className='visually-hidden'>Loading...</span>
                  </Spinner>
                  :
                  <div></div>
                }
              </div>
            </button>
          </div>
          {text && <><b>Thông tin cần tìm kiếm : </b><div style={{width:"53%",display:"flex",flexDirection:"row",justifyContent:"center", fontSize: "18px"}}> {text}</div> <div style={{ marginTop: '16px' }}></div></>}
          {error ? <div className='search__error'><i className='bx bx-error'></i> Request server error. Please try again!</div> : <div style={{ marginTop: '16px' }}></div>}
          {data.length > 0 && <div><b>Số lượng tài liệu liên quan: {data.length}</b></div>}
        </div>
        {data.length > 0 && data.map((item,index)=>{
          return (<ContentSearch item={item} key={index}/>);
        })}
        <Space60></Space60>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='1200'
          className='title-result'>
          <h5 className='txt-result'>
            Hãy bắt đầu tìm kiếm thông tin
          </h5>
          <Space40></Space40>
        </div>
        <Space120></Space120>
      </div>
    );
  }
}
