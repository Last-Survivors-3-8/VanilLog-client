import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NicknameEditor from '@src/components/Profile/NicknameEditor';

const mockUserData = {
  nickname: 'testUserNickname',
};

describe('<NicknameEditor />', () => {
  let toggleEditing, setNickname, updateNickname;

  beforeEach(() => {
    toggleEditing = jest.fn();
    setNickname = jest.fn();
    updateNickname = jest.fn();
  });

  const renderNicknameEditor = (props) =>
    render(
      <NicknameEditor
        editing={false}
        toggleEditing={toggleEditing}
        nickname={mockUserData.nickname}
        setNickname={setNickname}
        updateNickname={updateNickname}
        message=''
        {...props}
      />,
    );

  it('닉네임 편집 컴포넌트가 올바르게 렌더링 되어야 한다.', () => {
    const { getByText } = renderNicknameEditor();

    expect(getByText(mockUserData.nickname)).toBeInTheDocument();
  });

  it('변경하기 버튼을 클릭하면 편집 가능한 상태로 변경되어야 한다.', () => {
    const { getByText } = renderNicknameEditor();
    const editButton = getByText('변경하기');

    fireEvent.click(editButton);

    expect(toggleEditing).toHaveBeenCalled();
  });

  it('닉네임 변경이 완료되면 올바른 메시지가 나타나야 한다.', () => {
    const message = '닉네임이 성공적으로 업데이트되었습니다';
    const { getByText } = renderNicknameEditor({ message });

    expect(getByText(message)).toBeInTheDocument();
  });
});
