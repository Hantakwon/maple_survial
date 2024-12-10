package com.project.user.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import com.project.user.service.ScoreDO;
import com.project.user.service.ScoreService;
import com.project.user.service.UserDO;
import com.project.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Controller
@SessionAttributes({"userDO", "loginError", "signupError"})
@RequiredArgsConstructor
public class UserController {
	
	private final UserService userService;
	private final ScoreService scoreService;
    
	// 시작화면
    @GetMapping("/")
    public String home(Model model) {
    	String errorMessage = (String) model.getAttribute("loginError");
    	if (errorMessage != null) {
    		model.addAttribute("errorMessage", errorMessage);
    	}
        return "index"; 
    }
    
    // 로그인 후 홈 화면
	@PostMapping("/login.do")
	public String login(UserDO userDO, Model model) {
		model.addAttribute("userDO", userDO);
		model.addAttribute("loginError", "");
		UserDO user = userService.getUser(userDO);
		if (user != null) {
			if(user.getPassword().equals(userDO.getPassword())) {
				
				List<ScoreDO> warrior = scoreService.listCharacterScore(userDO.getId(), "전사");
				List<ScoreDO> magician = scoreService.listCharacterScore(userDO.getId(), "법사");
				List<ScoreDO> archer = scoreService.listCharacterScore(userDO.getId(), "궁수");
				List<ScoreDO> thief = scoreService.listCharacterScore(userDO.getId(), "도적");
				
				model.addAttribute("warrior", warrior);
				model.addAttribute("magician", magician);
				model.addAttribute("archer", archer);
				model.addAttribute("thief", thief);
				
				return "home";	
			}
			model.addAttribute("loginError", "비밀번호가 다릅니다.");
			return "redirect:/";
		}
		
		model.addAttribute("loginError", "존재하지 않는 아이디입니다.");
		return "redirect:/";
	}
	
	// 로그아웃
	@GetMapping("/logout.do")
	public String logout() {
		return "redirect:/";
	}
	
	// 시작버튼 누를 시 캐릭터 선택화면으로
	@GetMapping("/start.do")
	public String start(Model model) {
		UserDO userDO = (UserDO) model.getAttribute("userDO");

		model.addAttribute("userDO", userDO);
		return "characterInfo";
	}
	
	@GetMapping("/monster.do")
	public String monster() {
		return "monster";
	}
	
	@GetMapping("/home.do")
	public String retry(Model model) {
		UserDO userDO = (UserDO) model.getAttribute("userDO");
		List<ScoreDO> warrior = scoreService.listCharacterScore(userDO.getId(), "전사");
		List<ScoreDO> magician = scoreService.listCharacterScore(userDO.getId(), "법사");
		List<ScoreDO> archer = scoreService.listCharacterScore(userDO.getId(), "궁수");
		List<ScoreDO> thief = scoreService.listCharacterScore(userDO.getId(), "도적");
		
		model.addAttribute("warrior", warrior);
		model.addAttribute("magician", magician);
		model.addAttribute("archer", archer);
		model.addAttribute("thief", thief);
		model.addAttribute("userDO", userDO);
		
		return "home";
	}
	
	// 회원 가입 화면으로
	@GetMapping("/signup.do")
	public String signup(Model model) {
		String errorMessage = (String) model.getAttribute("signupError");
    	if (errorMessage != null) {
    		model.addAttribute("errorMessage", errorMessage);
    	}
		return "signup";
	}
	
	// 회원 가입 요청
	@PostMapping("/signup.do")
	public String signup(UserDO userDO, Model model) {
		model.addAttribute("userDO", userDO);
		
		UserDO user = userService.getUser(userDO);
		
		if (user == null) {
			userService.insertUser(userDO); 
			model.addAttribute("signupError","");
			return "redirect:/";
		}
		
		
		model.addAttribute("signupError", "이미 존재하는 아이디입니다.");
		return "redirect:/signup.do";				
	}
	
	// 게임 시작
	@GetMapping("/game.do")
	public String game(@RequestParam(value = "characterName") String characterName, Model model) {
		System.out.println("Received Data: " + characterName);
		model.addAttribute("characterName", characterName);
		return "game";
	}
	
	// 게임 끝
	@GetMapping("/gameOver.do")
	public String gameOver(
			@RequestParam(value = "score") String score,
			@RequestParam(value = "characterName") String characterName,
			Model model) {
		UserDO userDO = (UserDO) model.getAttribute("userDO");
		
		ScoreDO scoreDO = new ScoreDO();
		scoreDO.setId(userDO.getId());
		scoreDO.setCharacter(characterName);
		scoreDO.setScore(Integer.parseInt(score));
		
		scoreService.insertScore(scoreDO);
		
		model.addAttribute("userDO", userDO);
		model.addAttribute("characterName", characterName);
		model.addAttribute("score", score);
		return "gameOver";
	}
}
