package com.skilldistillery.waves.controllers;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skilldistillery.waves.entities.Beach;
import com.skilldistillery.waves.services.BeachService;

@RestController
@RequestMapping("api")
@CrossOrigin({"*", "http://localhost:4301"})
public class BeachController {
	
	@Autowired
	private BeachService beachSvc;
	
	@GetMapping("beaches")
	public List<Beach> index(HttpServletRequest req, HttpServletResponse res, Principal principal) {
		return beachSvc.index();
	}
	
	@GetMapping("beaches/{name}")
	public Beach showByName(HttpServletRequest req, HttpServletResponse res, @PathVariable String name, Principal principal) {
		return beachSvc.getBeachByName(name);
	}
	
//	@GetMapping("beaches/{bid}")
//	public Beach showById(HttpServletRequest req, HttpServletResponse res, @PathVariable int bid, Principal principal) {
//		return beachSvc.getBeachById(bid);
//	}
	
	@PostMapping("beaches")
	public Beach create(HttpServletRequest req, HttpServletResponse res, @RequestBody Beach beach, Principal principal) {
		beach = beachSvc.create(beach);
		if( beach == null) {
			res.setStatus(400);
		}
		return beach;
	}

	@PutMapping("beaches/{bid}")	
	public Beach update(HttpServletRequest req, HttpServletResponse res, @PathVariable int bid, @RequestBody Beach beach, Principal principal) {
		beach = beachSvc.update(principal.getName(), bid, beach);
		if (beach == null) {
			res.setStatus(400);
		}
		return beach;
	}

	@DeleteMapping("beaches/{bid}")
	public void destroy(HttpServletRequest req, HttpServletResponse res, @PathVariable int bid, Principal principal) {
		if(beachSvc.destroy(principal.getName(), bid)) {
			res.setStatus(204);
		}
		else {
			res.setStatus(404);
		}
	}
	

}
