package com.project.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.mapper.ScoreMapper;
import com.project.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServicebyMybatisImpl implements UserService {

	private final UserMapper userMapper;
	
	public void insertUser(UserDO userDO) {
		userMapper.insertUser(userDO);
	}

	public void updateUser(UserDO userDO) {
		userMapper.updateUser(userDO);
	}

	public void deleteUser(UserDO userDO) {
		userMapper.deleteUser(userDO.getId());
	}

	public UserDO getUser(UserDO userDO) {
		return userMapper.getUser(userDO.getId());
	}

	public List<UserDO> listUser() {
		return userMapper.getUserList();
	}
}
