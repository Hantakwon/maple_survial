package com.project.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.mapper.ScoreMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScoreServicebyMybatisImpl implements ScoreService {

	private final ScoreMapper scoreMapper;
	
	@Override
	public void insertScore(ScoreDO scoreDO) {
		scoreMapper.insertScore(scoreDO);
	}

	@Override
	public void updateScore(ScoreDO scoreDO) {
		scoreMapper.updateScore(scoreDO);
	}

	@Override
	public void deleteScore(ScoreDO scoreDO) {
		scoreMapper.deleteScore(scoreDO.getId());
	}

	@Override
	public ScoreDO getScore(ScoreDO scoreDO) {
		return scoreMapper.getScore(scoreDO.getId());
	}

	@Override
	public ScoreDO getCharacterScore(ScoreDO scoreDO) {
		return scoreMapper.getCharacterScore(scoreDO.getId(), scoreDO.getCharacter());
	}

	@Override
	public List<ScoreDO> listScore() {
		return scoreMapper.listScore();
	}

	@Override
	public List<ScoreDO> listCharacterScore(String id, String character) {
		return scoreMapper.listCharacterScore(id, character);
	}

}
