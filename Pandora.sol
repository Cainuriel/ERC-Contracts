	function _transferBurn(address sender, uint256 tBurn) private {
		uint256 currentRate = _getRate();
		uint256 rBurn = tBurn.mul(currentRate);		
		_rOwned[BURN_ADDRESS] = _rOwned[BURN_ADDRESS].add(rBurn);
		if(_isExcludedFromReward[BURN_ADDRESS])
			_tOwned[BURN_ADDRESS] = _tOwned[BURN_ADDRESS].add(tBurn);
		
		emit Transfer(sender, BURN_ADDRESS, tBurn);
			
			
	}
	
		function _transferProject(address sender, uint256 tProject) private {
		uint256 currentRate = _getRate();
		uint256 rProject = tProject.mul(currentRate);		
		_rOwned[_projectAddress] = _rOwned[_projectAddress].add(rProject);
		if(_isExcludedFromReward[_projectAddress])
			_tOwned[_projectAddress] = _tOwned[_projectAddress].add(tProject);
		
		emit Transfer(sender, _projectAddress, tProject);
	}
