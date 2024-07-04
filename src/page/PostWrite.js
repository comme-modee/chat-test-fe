import '../style/write.style.css';
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postActions } from '../action/postAction';
import CloudinaryUploadWidgetForWrite from "../utils/CloudinaryUploadWidgetForWrite";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import ClipLoader from 'react-spinners/ClipLoader';
import MDEditor from '@uiw/react-md-editor';
import { commonUiActions } from '../action/commonUiAction';
import noImg from '../asset/img/no-image.png';

const initialFormData = {
  title: '',
  content: '',
  image: '',
  tags: ''
};


const PostWrite = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ query, setQuery ] = useSearchParams();
  const [ type, setType ] = useState(query.get("type"));
  const [ postId, setPostId ] = useState(query.get("id") || '');
  const { user } = useSelector((state) => state.user);
  const { selectedPost, loading } = useSelector((state) => state.post);
  const [ formData, setFormData ] = useState({...initialFormData });
  const [ tagInputValue, setTagInputValue ] = useState('');
  const [ tagsTemp, setTagsTemp ] = useState(type === 'edit' ? selectedPost.tags : []);
  const [ contentValue, setContentValue ] = useState(type === 'edit' ? selectedPost.content : '');

  //selectedPost가 있으면 그 내용으로 채우고 없으면 null
  const [ editFormData, setEditFormData ] = useState(selectedPost ? {
    title: selectedPost.title, 
    content: selectedPost.content,
    image: selectedPost.image,
    tags: selectedPost.tags
  } : null);
  
  useEffect(()=>{
    if(!user) {
      navigate('/login')
    } 
  },[user])

  useEffect(()=>{
    if(postId !== '') {
      dispatch(postActions.getPostDetail(postId))
    }
  },[postId])

  const createPost = async (e) => {
    e.preventDefault();
    dispatch(postActions.createPost(formData, navigate));
  }

  const updatePost = async (e) => {
    e.preventDefault();
    dispatch(postActions.updatePost(postId, editFormData, navigate));
  }

  const handleKeyDown = (e) => {
    if(e.code === 'Enter') {
      e.preventDefault();
    }
    if (e.code === 'Backspace' && tagInputValue === '') {
      // 마지막 단어를 배열에서 삭제
      setTagsTemp(tagsTemp.slice(0, -1));
    } 
  }

  const handleKeyUp = (e) => {
    e.preventDefault();
    if((e.code === 'Enter' || e.code === 'Space') && tagInputValue.trim() !== '') {
      const newTag = tagInputValue.trim();
      if(tagsTemp.includes(newTag)) {
        dispatch(commonUiActions.showToastMessage("중복된 태그가 존재합니다.", "error"))
        setTagInputValue('');
        return;
      }
      setTagsTemp([...tagsTemp, newTag]);
      setTagInputValue(''); // 입력 필드 초기화
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    if(type === 'new') {
      setFormData({ ...formData, [id]: value });
    } else {
      setEditFormData({ ...editFormData, [id]: value });
    }
  }

  const uploadContentImage = (url) => {
    setContentValue(contentValue + `![image](${url})`)
  }

  const uploadImage = (url) => {
    if(type === 'new') {
      setFormData({ ...formData, image: url })
    } else {
      setEditFormData({ ...editFormData, image: url })
    }
  }

  useEffect(()=>{
    if(type === 'new') {
      setFormData({ ...formData, tags: tagsTemp })
    } else {
      setEditFormData({ ...editFormData, tags: tagsTemp })
    }
  },[tagsTemp])

  useEffect(()=>{
    if(type === 'new') {
      setFormData({ ...formData, content: contentValue })
    } else {
      setEditFormData({ ...editFormData, content: contentValue })
    }
  },[contentValue])

  const handleTagInputValue = (e) => {
    setTagInputValue(e.target.value)
  }

  const deleteTag = (e) => {
    const tag = e.target.innerText.replace(/#/g,'')
    const filteredTags = tagsTemp.filter((i) => i !== tag);
    setTagsTemp(filteredTags)
  }

  const errorController = (error) => {
    if(error) {
      dispatch(commonUiActions.showToastMessage('이미지 등록에 실패하였습니다. 다른 이미지로 시도해주세요.', 'error'))
    }
  }

  if(loading && !selectedPost) 
    return (
      <div className='loading'>
          <ClipLoader color="#28A745" loading={loading} size={100} />
      </div>
    )

  return (
    <div>
        {type === 'new' ? 
          // 새 포스트 form
          <Form onSubmit={createPost} className='write-form'>
            <Form.Group controlId="title" className='write-title'>
              <Form.Control
                type="text"
                placeholder="제목을 입력해주세요"
                required
                value={formData.title}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <div>
              <strong className='small-btn'>본문에 사진 추가 </strong>
              <CloudinaryUploadWidgetForWrite uploadContentImage={uploadContentImage} errorController={errorController}/>
            </div>

            <div data-color-mode='light' className='editor'>
                <MDEditor
                    height={600}
                    value={contentValue}
                    onChange={setContentValue}
                    highlightEnable={false}
                />
            </div>

            <Form.Group controlId="tags" className='write-tag'>
              {tagsTemp.map((tag, index) => <span className='tag' key={index} onClick={(e) => deleteTag(e)}>#{tag}</span>)}
              <div>
                #<Form.Control
                  type="text"
                  placeholder="태그 입력"
                  value={tagInputValue}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onKeyUp={(e) => handleKeyUp(e)}
                  onChange={(e) => handleTagInputValue(e)}
                />
              </div>
            </Form.Group>

            <div className="thumbnail-img display-center-center gap-10">
                <div className='display-center-center'>
                  <strong>썸네일</strong>
                  <CloudinaryUploadWidget uploadImage={uploadImage} errorController={errorController}/>
                </div>
                <div className='img'>
                  <img id="uploadedimage" src={formData.image || noImg} alt=""/>
                </div>
            </div>

            <div className="submit">
              <button className='green-btn' type="submit">
                등록
              </button>
            </div>
          </Form> 



          //////////////////////////////////////////////////////////////////////////
          // 포스트 수정 form ↓↓↓↓↓↓↓
          
          : type === 'edit' ?
          <Form onSubmit={updatePost} className='write-form'>
            <Form.Group controlId="title" className='write-title'>
              <Form.Control
                type="text"
                placeholder="제목을 입력해주세요"
                required
                value={editFormData.title}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <div>
              <strong className='small-btn'>본문에 사진 추가 </strong>
              <CloudinaryUploadWidgetForWrite uploadContentImage={uploadContentImage} />
            </div>

            <div data-color-mode='light' className='editor'>
                <MDEditor
                    height={600} 
                    value={contentValue}
                    onChange={setContentValue}
                    highlightEnable={false}
                />
            </div>

            <Form.Group controlId="tags" className='write-tag'>
              {tagsTemp.map((tag, index) => <span className='tag' key={index} onClick={(e) => deleteTag(e)}>#{tag}</span>)}
              <div>
                #<Form.Control
                  type="text"
                  placeholder="태그 입력"
                  value={tagInputValue}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onKeyUp={(e) => handleKeyUp(e)}
                  onChange={(e) => handleTagInputValue(e)}
                />
              </div>
            </Form.Group>

            <div className="thumbnail-img display-center-center gap-10">
                <div className='display-center-center'>
                  <strong>썸네일</strong>
                  <CloudinaryUploadWidget uploadImage={uploadImage} />
                </div>
                <div className='img'>
                  <img id="uploadedimage" src={editFormData.image || noImg} alt=""/>
                </div>
            </div>

            <div className="submit">
              <button className='green-btn' type="submit">
                {type === 'new' ? '등록' : '수정'}
              </button>
            </div>
          </Form> : <></>
        }

    </div>
  )
}

export default PostWrite