package com.project.user.service;

import java.util.List;

public interface ScoreService {
	
	void insertScore(ScoreDO scoreDO);
	
	void updateScore(ScoreDO scoreDO);
	
	void deleteScore(ScoreDO scoreDO);
	
	ScoreDO getScore(ScoreDO scoreDO);
	
	ScoreDO getCharacterScore(ScoreDO scoreDO);
	
	List<ScoreDO> listScore();
	
	List<ScoreDO> listCharacterScore(String id, String character);
	
}
