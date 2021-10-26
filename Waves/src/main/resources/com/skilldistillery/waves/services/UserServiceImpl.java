package com.skilldistillery.waves.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.waves.entities.User;
import com.skilldistillery.waves.repositories.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepo;
	
	@Override
	public User getUserByName(String username) {
		return userRepo.findByUsername(username);
	}
	

}
